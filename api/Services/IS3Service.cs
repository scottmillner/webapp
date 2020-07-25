using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace webapi.Services
{
    public interface IS3Service
    {
        Task<Stream> GetImageFromS3(IConfiguration config, string imageName);
    }
}
