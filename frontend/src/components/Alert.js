import React from 'react'

export default function Alert(props) {
    const { reason } = props
    return (
        <>
            <div class="flex w-full max-w-sm bg-white  ">
                <div class="mx-3 flex">
                    <svg class="w-6 h-6 text-red-600 fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                    </svg>
                    <p class="mx-2 text-md text-red-500">
                        {reason}
                    </p>
                </div>
            </div>
        </>
    )
}
