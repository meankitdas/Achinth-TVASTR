import { rasProduct } from '@/content/products/ras'
import { piProduct } from '@/content/products/pi'
import { SectionShell } from '@/components/primitives/SectionShell'
import { ProductCard } from '@/components/ProductCard'

export function ProductsSection() {
  return (
    <SectionShell id="products" type="products" content={{ title: "Products" }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-12">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black text-metallic-100 leading-tight tracking-tight mb-6">
            Products
          </h2>
          <p className="text-base text-metallic-400 leading-relaxed max-w-2xl text-center mb-12">
            Tvastr delivers modular intelligence layers designed to transform manufacturing operations. Each module builds on the core platform to deliver increasing depth of insight.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-charcoal-950 rounded-2xl p-4 md:p-8">
          <ProductCard
            product={rasProduct}
            visual="defect"
            index={0}
          />
          <ProductCard
            product={piProduct}
            visual="dataflow"
            index={1}
          />
        </div>
      </div>
    </SectionShell>
  )
}