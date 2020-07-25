using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Xml.Schema;
using Amazon.S3;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using webapi.Services;

namespace webapi.Controllers
{
    [EnableCors("LocalHostPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class S3Controller : ControllerBase
    {
        private readonly ILogger<S3Controller> _logger;
        private readonly IConfiguration _configuration;
        private readonly IS3Service _s3Service;

        public S3Controller(ILogger<S3Controller> logger, IS3Service s3Service, IConfiguration configuration)
        {
            _logger = logger;
            _s3Service = s3Service;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string image)
        {
            try
            {
                var imageStream = await _s3Service.GetImageFromS3(_configuration, image);

                return File(imageStream, "image/jpeg");
            }
            catch (AmazonS3Exception e)
            {
                Console.WriteLine("Error encountered. Message: '{0}' when writing an object", e.Message);
                throw;
            }
            catch (Exception e)
            {
                Console.WriteLine("Unknown error encountered on server. Message: '{0}' when writing an object", e.Message);
            }

            return Ok();
        }
    }
}
