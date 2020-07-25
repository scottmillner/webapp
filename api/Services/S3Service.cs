using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;

namespace webapi.Services
{
    public class S3Service: IS3Service
    {
        private readonly IAmazonS3 _client;

        public S3Service(IAmazonS3 client)
        {
            _client = client;
        }

        public async Task<Stream> GetImageFromS3(IConfiguration config, string imageName)
        {
            var fileName = config[$"AppSettings:S3:{imageName}"];
            var request = new GetObjectRequest
            {
                BucketName = config["AppSettings:S3:AWSS3Bucket"],
                Key = fileName
            };

            using var response = await _client.GetObjectAsync(request);
            await using var responseStream = response.ResponseStream;
            var stream = new MemoryStream();
            await responseStream.CopyToAsync(stream);
            stream.Position = 0;

            return stream;
        }
    }
}
