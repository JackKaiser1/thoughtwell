import { apiErrorHandler, printError } from '@/lib/errorHandler.js';
import { loosePagesRoute, serverURL } from '@/constants.js';
import { type LooseContentResponse } from "@/types/response.js";
import { useLooseContentStore } from '@/stores/loose-pages.js';
import { useRoute } from 'vue-router';

export async function fetchLoosePages() {
    const url = `${serverURL}/api/loosePages`;

    try {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${sessionStorage.accessToken}`
            }
        });

        if (!response.ok) {
            apiErrorHandler(response);
            throw new Error;
        }

        const result: LooseContentResponse = await response.json();

        console.log(result.loosePages);

        useLooseContentStore().loosePages = result.loosePages;
        useLooseContentStore().looseSketches = result.looseSketches;

        // console.log(useLooseContentStore().loosePages);

    } catch (err) {
        printError
    }
    
}

export async function refreshLoosePages() {
    await fetchLoosePages();

    console.log("Fetched Loose Pages");
}