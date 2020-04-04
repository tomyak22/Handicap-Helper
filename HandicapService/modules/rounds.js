const rounds = [
    {
        id: '1234',
        score: 76,
        course: 'Chantilly National',
        rating: 67.8,
        slope: 123,
        date: '04/04/2020'
    },
    {
        id: '5678',
        score: 77,
        course: 'International CC',
        rating: 68.8,
        slope: 130,
        date: '04/02/2020'
    }
]

exports.list = () => {
    return JSON.parse(rounds);
}