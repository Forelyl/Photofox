import {Suspense, useEffect, useState} from "react";
import {Await, useLoaderData} from "react-router-dom";


export default function Tags( { select = true } ) {
    const { tags } = useLoaderData();

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={ tags }>
                {(loadedData) => {
                    return (
                        <div>
                            <p>hello</p>
                        </div>
                    )
                }}
            </Await>
        </Suspense>
    );
}

async function handleLoad() {

}