

export default function useTagsLoad(setTags) {
    fetch(`http://photofox.pp.ua/api/tag/all`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(values => {
        setTags(values);
    });
}