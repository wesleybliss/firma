export type FontDefinition = {
    name: string
    family: string
    url: string // CSS URL to fetch the actual font file URL from, or direct file URL
}

export const GOOGLE_FONTS: FontDefinition[] = [
    {
        name: 'Inter',
        family: 'Inter',
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
    },
    {
        name: 'Roboto',
        family: 'Roboto',
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
    },
    {
        name: 'Open Sans',
        family: 'Open Sans',
        url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap',
    },
    {
        name: 'Lato',
        family: 'Lato',
        url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
    },
    {
        name: 'Montserrat',
        family: 'Montserrat',
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
    },
    {
        name: 'Oswald',
        family: 'Oswald',
        url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap',
    },
    {
        name: 'Merriweather',
        family: 'Merriweather',
        url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
    },
    {
        name: 'Playfair Display',
        family: 'Playfair Display',
        url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
    },
]
