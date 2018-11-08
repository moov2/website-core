# Moov2 Website

Rebuild of [moov2.com](https://moov2.com) using [Orchard Core](https://github.com/OrchardCMS/OrchardCore).

Original site built using [Orchard CMS](https://github.com/OrchardCMS/Orchard) can be found at [https://github.com/moov2/website](https://github.com/moov2/website).

## Build Status

[![Build Status](https://secure.travis-ci.org/moov2/website-core.png?branch=master)](http://travis-ci.org/moov2/website-core)

## Prerequisities

### [.NET Core](https://docs.microsoft.com/en-us/dotnet/core/)

Orchard Core runs on the .NET Core. Download the latest version from [https://www.microsoft.com/net/download/core](https://www.microsoft.com/net/download/core).

### [NodeJS](https://nodejs.org/en/)

The theme requires NodeJS to assist with gathering third party front-end depedencies and compiles front-end assets. Compilation of front-end assets is handled by [Webpack](https://webpack.js.org/).

## Getting Started

Clone the repository using the command `git clone https://github.com/moov2/website-core.git`.

### Command Line

Navigate to `src/Moov2.Website` and run `dotnet run`. Open your browser to the specified URL and you'll be presented with the [Orchard Core setup page](https://orchardcore.readthedocs.io/en/dev/docs/getting-started/README/#setup-your-application).

### Visual Studio 2017

Open `Moov2.Website.sln` and build the solution. Ensure the `Moov2.Website` is the default project and run it to be presented with the [Orchard Core setup page](https://orchardcore.readthedocs.io/en/dev/docs/getting-started/README/#setup-your-application).

## Contributing

### Orchard Core Packages

We're living life on the edge and using [nightly builds](https://myget.org/feed/orchardcore-preview/package/nuget/OrchardCore.Application.Cms.Targets) of Orchard Core. When adding references to Orchard Core packages be sure to use **1.0.0-beta3-69192**. All bespoke modules that have been referenced by this project are also targetting the same build.
