
export const DATE_FORMATS = [
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
    { label: 'Month DD, YYYY', value: 'MMMM DD, YYYY' },
    { label: 'DD Month YYYY', value: 'DD MMMM YYYY' },
]

export const formatDate = (date: Date, format: string): string => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const pad = (n: number) => n.toString().padStart(2, '0')

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ]

    let result = format

    // Replace Year
    result = result.replace('YYYY', year.toString())

    // Replace Month (Long)
    if (result.includes('MMMM')) {
        result = result.replace('MMMM', monthNames[month - 1])
    }

    // Replace Month (Numeric)
    result = result.replace('MM', pad(month))

    // Replace Day
    result = result.replace('DD', pad(day))

    return result
}
