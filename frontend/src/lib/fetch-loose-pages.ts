import { apiErrorHandler, printError } from '@/lib/errorHandler.js';
import { loosePagesRoute, serverURL } from '@/constants.js';
import { type PageResponse } from "@/types/response.js";
import { useLoosePageStore } from '@/stores/loose-pages.js';
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

        const result: PageResponse[] = await response.json();

        useLoosePageStore().loosePages = result;

    } catch (err) {
        printError
    }
    
}

export async function refreshLoosePages() {
    await fetchLoosePages();

    console.log("Fetched Loose Pages");
}