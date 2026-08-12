/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://ramedicconsultancyandcreativeltd.org',
    generateRobotsTxt: true,
    exclude: ['/admin', '/admin/*', '/api', '/api/*', '/portal', '/portal/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/admin/*', '/api', '/api/*', '/portal', '/portal/*'],
            },
        ],
    },
}
