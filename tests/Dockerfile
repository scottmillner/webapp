FROM mcr.microsoft.com/dotnet/core/sdk:3.0-alpine AS build
WORKDIR /app
COPY ["tests.csproj", ""]
RUN dotnet restore "./tests.csproj"
COPY . .
WORKDIR "/app/."
RUN dotnet build 

FROM build AS tests
WORKDIR /app/tests/S3ServiceTests
RUN dotnet test --verbosity=normal