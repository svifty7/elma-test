<template>
    <div id="app" class="app">
        <div class="task-table">
            <persons />
        </div>

        <modal></modal>
    </div>
</template>

<script>
    import persons from "@/components/persons";
    import modal from "@/components/modal";

    export default {
        name: 'App',
        components: { persons, modal }
    }
</script>

<style lang="less">
    @import "./styles/style.less";
</style>
