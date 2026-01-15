import Hero from "@/components/home/Hero";

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Desktop: Grid de 2 columnas / Mobile: Flex column */}
            <div className="flex flex-col md:grid md:grid-cols-[400px_1fr] lg:grid-cols-[500px_1fr] min-h-screen">

                {/* Columna Izquierda / Hero */}
                {/* En desktop es sticky y ocupa toda la altura. En mobile es un bloque más */}
                <aside className="md:sticky md:top-0 md:h-screen w-full border-r border-gray-300 bg-gray-50 z-10">
                    <div className="h-full w-full p-4">
                        <Hero />
                    </div>
                </aside>

                {/* Columna Derecha / Contenido */}
                <section className="flex flex-col gap-8 p-8 bg-custom-celeste/30 min-h-full">
                    {/* Sección Colecciones - Fondo Celeste Suave */}
                    <div className="p-12 rounded-lg bg-custom-celeste/50 border border-white/50">
                        <h3 className="text-xl font-light tracking-wider mb-4 text-custom-text-main">COLECCIONES</h3>
                        <p className="text-custom-text-sec">Placeholder de colecciones...</p>
                        <div className="h-96 bg-custom-crema mt-4 rounded-sm border border-white/50"></div>
                    </div>

                    {/* Sección Productos - Fondo Crema Intercalado */}
                    <div className="p-12 rounded-lg bg-custom-crema border border-custom-rosa/20">
                        <h3 className="text-xl font-light tracking-wider mb-4 text-custom-text-main">PRODUCTOS</h3>
                        <p className="text-custom-text-sec">Placeholder de listado de productos...</p>
                        <div className="h-[150vh] bg-custom-celeste/20 mt-4 rounded-sm flex items-center justify-center text-custom-text-sec border border-white/50">
                            Contenido largo para probar scroll
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
