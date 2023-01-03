<script lang="ts">
    export let icon: string | null = '';
    export let title: string | null = '';
    export let content: string | null = '';
    export let color: string | null = 'yellow';
</script>

<div id="notice" style="background-color: {color}">
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
        width: 80%;
        margin-top: 12px;
        border-radius: 15px;
        padding: 0 16px;

        
        i {
            filter: invert(1);
            font-size: 30px;
            margin-right: 20px;
        }
        
        span {
            filter: invert(1);
            width: 100%;

            * {
                margin: 6px 0;
            }
        }
    }
</style>
