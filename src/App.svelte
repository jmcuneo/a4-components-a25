<script>
    let container;

    let username = $state();
    let message = $state();

    let lastMessageAt = 0;
    let messages = $state([]);

    $effect(() => {
        if (lastMessageAt < messages[messages.length - 1]?.sentAt) {
            container.scroll({top: container.scrollHeight, behavior: 'smooth'});
            lastMessageAt = messages[messages.length - 1].sentAt;
        }
    });

    const refresh = async function () {
        const response = await fetch("/messages");
        messages = await response.json();
    }

    const submit = async function (event) {
        event.preventDefault();

        const json = { from: username || 'Anonymous', message: message, sentAt: Date.now() };
        message = '';

        await fetch("/messages", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });

        await refresh();
    }

    refresh();
    setInterval(refresh, 2500);
</script>

<div class="card">
    <div bind:this={container} id="messages">
        {#each messages as message(message.sentAt) }
            {@const date = new Date(message.sentAt) }

            <div>
                <p><strong style:color={message.fromStyle}>{message.from}:</strong> {message.message}</p>
                <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
            </div>
        {:else}
            <p>Connecting to the server...</p>
        {/each}
    </div>
    <form onsubmit={submit}>
        <input bind:value={username} type="text" id="from" placeholder="Set a display name" aria-label="Display Name">
        <input bind:value={message} type="text" id="message" placeholder="Type a message..." aria-label="Message" required>
        <button type="submit">Send</button>
    </form>
</div>