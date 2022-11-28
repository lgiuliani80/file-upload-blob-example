using System.Reflection;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Microsoft.AspNetCore.Mvc;

namespace FileUploadOnBlobs.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadController : Controller
    {
        private IConfiguration _config;
        private ILogger<UploadController> _log;

        public UploadController(IConfiguration config, ILogger<UploadController> log) {
            _config = config;
            _log = log;
        }

        [HttpGet("version")]
        public string GetVersion() => Assembly.GetEntryAssembly()!.GetCustomAttribute<AssemblyFileVersionAttribute>()!.Version.ToString();

        [HttpPost("simple")]
        public async Task<IActionResult> UploadFile(string blobName)
        {
            BlobClient bc = new BlobClient(_config["StorageAccountConnectionString"], "uploads", blobName);

            var info = await bc.UploadAsync(Request.BodyReader.AsStream(), true);

            return Ok(info.Value);
        }

        [HttpPost("fragment")]
        public async Task<IActionResult> UploadFileFragment(string blobName, long position)
        {
            AppendBlobClient bc = new AppendBlobClient(_config["StorageAccountConnectionString"], "uploads", blobName);
            
            await bc.CreateIfNotExistsAsync();
            var p = await bc.GetPropertiesAsync();

            if (Request.ContentLength > bc.AppendBlobMaxAppendBlockBytes) {
                return BadRequest($"Maximum block size is {bc.AppendBlobMaxAppendBlockBytes}");
            } else if (position < p.Value.ContentLength) {
                return Ok(p.Value.ContentLength);
            } else if (position > p.Value.ContentLength) {
                return new StatusCodeResult(406);
            } else {
                MemoryStream ms = new MemoryStream();
                await Request.Body.CopyToAsync(ms);
                ms.Position = 0;
                var ur = await bc.AppendBlockAsync(ms);
                p = await bc.GetPropertiesAsync();

                return Ok(p.Value.ContentLength);
            }
        }

        [HttpDelete("file")]
        public async Task<IActionResult> DeleteFile(string blobName) 
        {
            BlobClient bc = new BlobClient(_config["StorageAccountConnectionString"], "uploads", blobName);

            try 
            {
                await bc.DeleteAsync();
            }
            catch (Azure.RequestFailedException ex) when (ex.Status == 404) 
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("md5")]
        public async Task<string> ComputeMD5(string blobName) 
        {
            BlobClient bc = new BlobClient(_config["StorageAccountConnectionString"], "uploads", blobName);
            MD5 md5 = MD5.Create();

            var headers = await bc.GetPropertiesAsync();

            if (headers?.Value?.ContentHash != null) 
            {
                return Convert.ToHexString(headers.Value.ContentHash);
            }

            using var br = await bc.OpenReadAsync();

            byte[] hashOut = new byte[16];
            byte[] buffer = new byte[4096];
            int read = await br.ReadAsync(buffer, 0, buffer.Length);

            while (read > 0) 
            {
                md5.TransformBlock(buffer, 0, read, buffer, 0);

                read = await br.ReadAsync(buffer, 0, buffer.Length);
            }

            md5.TransformFinalBlock(buffer, 0, 0);

            try
            {
                await bc.SetHttpHeadersAsync(new BlobHttpHeaders { ContentHash = md5.Hash });
            }
            catch (Exception) { }

            return Convert.ToHexString(md5.Hash!);
        }
    }
}
