FROM mcr.microsoft.com/dotnet/core/sdk:3.0-alpine AS build
WORKDIR /app

COPY api.sln .
COPY api/api.csproj ./api/
COPY tests/tests.csproj ./tests/
RUN dotnet restore

COPY . .

RUN dotnet build

FROM build AS tests
WORKDIR /app/tests
CMD ["dotnet", "test", "--verbosity=normal"]