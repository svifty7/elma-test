<template>
    <div id="app" class="app">
        <div class="task-table">
            <persons />
        </div>
    </div>
</template>

<script>
    import persons from "@/components/persons";

    export default {
        name: 'App',
        components: { persons }
    }
</script>

<style lang="less">
    @import "./styles/style.less";
</style>
