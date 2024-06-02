import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";

export default function useSubsScrollLoad(lastImage, login, load_type) {
    const [loading, setLoading] = useState(true);
    const [subs, setSubs] = useState([]);
    const [subsLeft, setSubsLeft] = useState(false);
    const [error, setError] = useState(false);
    let newStart = lastImage;
    useEffect(() => {
        setSubs([]);
        lastImage = -1;
    }, [load_type]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        let mode = '';
        if(load_type === "on_me") {
            mode = 'by';
        }
        else if (load_type === "me_on") {
            mode = 'on';
        }
        else {
            throw new Error("Unsupported type");
        }
        const controller = new AbortController();
        const signal = controller.signal;
        let fetch_string = `${import.meta.env.VITE_API_URL}/subscribe/get/${mode}?login=${login}&last_profile_id=${newStart}`;

        let headersQuery = {
                'Content-Type': 'application/json',
                'Authorization': getToken()
            }

        fetch(fetch_string, {
            method: 'GET',
            headers: headersQuery,
            signal: signal,
        })
        .then(response => response.json())
        .then(values => {
            console.log(values);
            setSubs((prevSubs) => {
                const allSubs = [...prevSubs, ...values];
                const idMap = new Map();

                return allSubs.filter((sub) => {
                    if (!idMap.has(sub.id)) {
                        idMap.set(sub.id, true);
                        return true;
                    }
                    return false;
                });
            });
            setSubsLeft(values.length === 30);
            setTimeout(() => setLoading(false), 1000);
        })
        .catch(error => {
            if (error.name === 'AbortError') return;
            setError(true);
        });
        return () => controller.abort();

    }, [newStart]);

    return { loading, subs, subsLeft, error };
}