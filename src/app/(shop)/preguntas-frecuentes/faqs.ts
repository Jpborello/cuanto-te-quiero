export interface FAQItem {
    question: string;
    answer: string;
}

// Shared by the page (accordion) and the layout (FAQPage JSON-LD)
export const FAQS: FAQItem[] = [
    {
        question: "¿Tienen devolución?",
        answer: "Para devoluciones y problemas con productos, por favor contactarse por WhatsApp con nuestro soporte."
    },
    {
        question: "¿Tienen garantía los productos?",
        answer: "Todo lo que es mueblería trabajamos con productos de alta calidad. Siempre hacemos chequeos frecuentes de nuestros productos para que cuando los tengas que usar o armar no tengas mayores complicaciones."
    },
    {
        question: "¿Los muebles vienen armados?",
        answer: "Los muebles pueden ir armados o desarmados, siempre dependiendo del producto y el tamaño del mismo."
    },
    {
        question: "¿Vivo en un edificio, ustedes lo suben?",
        answer: "Sí, contamos con personal para ese servicio. Aun así, siempre consultar previamente con un asesor."
    }
];
