import React, { useState, useRef, useCallback, useLayoutEffect, FormEvent } from 'react'
import Button from './Button'
import ProfileImage from './ProfileImage'
import { useSession } from 'next-auth/react'
import { api } from '~/utils/api'

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

export default function NewTweetForm() {

    const session = useSession();
    if (session.status !== "authenticated") return

    return <Form />

}

function Form() {
    const session = useSession();

    const [inputValue, setInputValue] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement>();
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea
    }, [])

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current)
    }, [inputValue])

        if (session.status !== "authenticated") return null

        const trpcUtils = api.useContext()
    const createTweet = api.tweet.create.useMutation({
        onSuccess: (newTweet) => {
            setInputValue("");

            if (session.status !== "authenticated") return 

            trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
                if(oldData == null || oldData.pages[0] == null) return

                const newCacheTweet = {
                    ...newTweet,
                    likeCount: 0,
                    likedByMe: false,
                    user: {
                        id: session.data.user.id,
                        name: session.data.user.name || null,
                        image: session.data.user.image || null,
                    }
                }
                return {
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            tweets: [newCacheTweet, ...oldData.pages[0].tweets],
                        },
                        ...oldData.pages.slice(1),
                    ]
                }
            })
        }
    })

    function handleSubmit(e: FormEvent){
        e.preventDefault()

        createTweet.mutate({ content: inputValue})
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b px-4 py-2">
                <div className="flex gap-2">
                    <ProfileImage src={session.data.user.image} />
                    <textarea
                        ref={inputRef}
                        style={{ height: 0 }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
                        placeholder="What's happening?!"
                    />
                </div>
                <Button className=" self-end">Tweet</Button>
            </form>
        </>
    )
}


