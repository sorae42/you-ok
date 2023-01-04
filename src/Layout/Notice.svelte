<script lang="ts">
    export let icon: string | null = '';
    export let title: string | null = '';
    export let content: string | null = '';
    export let color: string | null = 'yellow';
    export let textColor: boolean | null = false;
</script>

<div id="notice" style="background-color:{color}; color:{textColor ? 'white' : 'black'}">
    <i class="fa-solid fa-{icon}" />
    <span>
        <p><strong>{title}</strong></p>
        <p>{content}</p>
    </span>
</div>

<style lang="scss">
    div#notice {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
        color: black;
        width: 21.5em;
        margin: 12px 0;
        border-radius: 15px;
        padding: 0 16px;

        i {
            font-size: 30px;
            margin-right: 20px;
        }

        span {
            width: 100%;

            * {
                margin: 6px 0;
            }
        }
    }
</style>
