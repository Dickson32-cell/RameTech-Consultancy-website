/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://ramedicconsultancyandcreativeltd.org',
    generateRobotsTxt: true,
    exclude: ['/admin', '/admin/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api/v1/admin'],
            },
        ],
    },
}
