using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace Moov2.Website
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOrchardCms();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            app.UseOrchardCore();
        }
    }
}
