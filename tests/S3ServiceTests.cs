using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using NSubstitute.Core.Arguments;
using NUnit.Framework;
using webapi.Services;

namespace tests
{
    [TestFixture]
    public class S3ServiceTests
    {
        private IConfiguration _configuration;

        [SetUp]
        public void Setup()
        {
            _configuration = TestHelper.GetConfiguration(TestContext.CurrentContext.TestDirectory);
        }

        [Test]
        public void S3Service_AmazonClient_IsPassed_Correct_Request()
        {
            // Arrange
            var mockAmazonClient = Substitute.For<IAmazonS3>();
            var s3Service = new S3Service(mockAmazonClient);

            mockAmazonClient.GetObjectAsync(Arg.Any<GetObjectRequest>()).Returns(new GetObjectResponse());
            var expectedRequest = new GetObjectRequest
            {
                BucketName = "webapp-images-bucket",
                Key = "DenverCP.jpg"
            };

            // Act
            // only testing what's passed to the client and not making actual request
            // so doesn't need to be awaited
            s3Service.GetImageFromS3(_configuration, "DenverImage");

            // Assert
            mockAmazonClient
                .Received(1)
                .GetObjectAsync(Arg.Is<GetObjectRequest>(request => RequestDataPropertiesMatch(request, expectedRequest)));
        }

        private static bool RequestDataPropertiesMatch(GetObjectRequest resultRequest, GetObjectRequest expectedRequest)
        {
            return resultRequest.BucketName == expectedRequest.BucketName &&
                   resultRequest.Key == expectedRequest.Key;
        }
    }
}
