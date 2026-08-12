import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kraft Paper Bags | RAMEDIC Consultancy and Creative LTD',
    description: 'Custom-designed paper bags for every occasion — weddings, funerals, parties, food deliveries, engagements, and more. Based in Koforidua, Eastern Region, Ghana.',
}

const pricingData = {
    customisedBags: {
        title: 'Customised Bags',
        note: 'MOQ: 50 pieces',
        items: [
            { size: 'A4', price: 'GHS 8.00' },
            { size: 'A3', price: 'GHS 10.00' },
            { size: 'A2', price: 'GHS 12.00' },
        ],
    },
    uncustomisedBags: {
        title: 'Uncustomised Bags',
        note: 'MOQ: 50 pieces',
        items: [
            { size: 'A4', price: 'GHS 5.00' },
            { size: 'A3', price: 'GHS 6.00' },
            { size: 'A2', price: 'GHS 8.00' },
        ],
    },
    brownKraftCustomised: {
        title: 'Brown Paper Kraft — Customised',
        note: 'Price per order',
        items: [
            { size: '50 pieces', price: 'GHS 150.00' },
            { size: '100 pieces', price: 'GHS 250.00' },
            { size: '150 pieces', price: 'GHS 400.00' },
            { size: '200 pieces', price: 'GHS 550.00' },
            { size: '250 pieces', price: 'GHS 700.00' },
        ],
    },
    brownKraftUncustomised: {
        title: 'Brown Paper Kraft — Uncustomised',
        note: 'Price per order',
        items: [
            { size: '50 pieces', price: 'GHS 120.00' },
            { size: '100 pieces', price: 'GHS 200.00' },
            { size: '150 pieces', price: 'GHS 300.00' },
            { size: '200 pieces', price: 'GHS 400.00' },
            { size: '250 pieces', price: 'GHS 500.00' },
        ],
    },
    screenPrinting: {
        title: 'Screen Printing (Nylon Bags)',
        note: 'Price per bag. Multiple colors come at extra cost.',
        items: [
            { size: '60×70 cm', price: 'GHS 10.00' },
            { size: '50×60 cm', price: 'GHS 7.00' },
            { size: '45×55 cm', price: 'GHS 6.00' },
            { size: '35×45 cm', price: 'GHS 5.50' },
            { size: '28×47 cm', price: 'GHS 5.00' },
            { size: '25×35 cm', price: 'GHS 4.00' },
        ],
    },
}

function PricingTable({ category }: { category: typeof pricingData.customisedBags }) {
    return (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-primary to-secondary p-5">
                <h3 className="text-lg font-heading font-bold text-white">{category.title}</h3>
                {category.note && <p className="text-xs text-white/70 mt-1">{category.note}</p>}
            </div>
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Size / Quantity</th>
                        <th className="text-right px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price (GHS)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {category.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{item.size}</td>
                            <td className="px-5 py-3.5 text-sm font-bold text-accent text-right">{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default function KraftPaperBagsPage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
                            🛍️ Creative Department
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                            RAMEDIC Kraft Paper Bags
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto">
                            Custom-designed paper bags for every occasion — weddings, funerals, parties, food deliveries, engagements, and more.
                        </p>
                        <p className="text-base text-white/60 mt-3">📍 Based in Koforidua, Eastern Region, Ghana</p>
                    </div>
                </div>
            </section>

            {/* Notes */}
            <section className="py-8 bg-amber-50 border-b border-amber-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <span className="flex items-center gap-2 text-amber-800 font-medium">
                            ⚠️ Preferred sizes bigger than listed come with extra costs.
                        </span>
                        <span className="flex items-center gap-2 text-amber-800 font-medium">
                            🎨 Multiple colors on screen print bags come at extra cost.
                        </span>
                        <span className="flex items-center gap-2 text-amber-800 font-medium">
                            📦 MOQ for individual bags: 50 pieces.
                        </span>
                    </div>
                </div>
            </section>

            {/* Pricing Tables */}
            <section className="py-16 md:py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-accent font-semibold text-sm uppercase tracking-wider">Complete Price List</span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mt-3 mb-4">
                            Our Pricing
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            All prices are in Ghana Cedis (GHS). Contact us for bulk orders or custom sizes.
                        </p>
                    </div>

                    {/* White/Gift Paper Bags */}
                    <div className="mb-10">
                        <h2 className="text-xl font-heading font-bold text-text mb-5 flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">🛍</span>
                            White / Gift Paper Bags
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PricingTable category={pricingData.customisedBags} />
                            <PricingTable category={pricingData.uncustomisedBags} />
                        </div>
                    </div>

                    {/* Brown Kraft */}
                    <div className="mb-10">
                        <h2 className="text-xl font-heading font-bold text-text mb-5 flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">📦</span>
                            Brown Paper Kraft Bags
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PricingTable category={pricingData.brownKraftCustomised} />
                            <PricingTable category={pricingData.brownKraftUncustomised} />
                        </div>
                    </div>

                    {/* Screen Printing */}
                    <div className="mb-10">
                        <h2 className="text-xl font-heading font-bold text-text mb-5 flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">🖨</span>
                            Screen Printing (Nylon Bags)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PricingTable category={pricingData.screenPrinting} />
                            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10 flex flex-col justify-center">
                                <h4 className="text-lg font-bold text-text mb-3">📞 Ready to Order?</h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Contact us to place your custom bag order. We handle everything from design to delivery for businesses across Ghana.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                                    <li className="flex items-center gap-2">✅ Fast turnaround time</li>
                                    <li className="flex items-center gap-2">✅ Custom branding available</li>
                                    <li className="flex items-center gap-2">✅ Bulk order discounts</li>
                                    <li className="flex items-center gap-2">✅ Delivery across Ghana</li>
                                </ul>
                                <Link
                                    href="/contact"
                                    className="block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primaryDark transition-colors"
                                >
                                    Get a Quote
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Order Your Custom Bags?</h2>
                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        Let us help you make a lasting impression with beautifully branded paper bags for your business or event.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="btn-accent text-lg px-8 py-4 cursor-pointer">
                            Place an Order
                        </Link>
                        <Link href="/services" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer text-lg">
                            View All Services
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
