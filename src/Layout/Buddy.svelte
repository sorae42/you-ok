<script lang="ts">
    import Notice from './Notice.svelte';
</script>

<svelte:head>
    <title>Coming Soon! - YouOkay</title>
</svelte:head>

<Notice
    icon="triangle-exclamation"
    title="Buddy List is in the work!"
    content="The core function is very buggy. Some stuff might not work or even break."
/>
<Notice
    icon="triangle-exclamation"
    title="Buddy List is not secure!"
    content="Security protocol for the buddy system is currently turned off for development."
/>
