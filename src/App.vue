<template>
    <div id="app" class="app">
        <div class="task-table">
            <persons v-if="tableData" :users="tableData" />
        </div>

        <modal></modal>
    </div>
</template>

<script>
    import persons from "@/components/persons";
    import modal from "@/components/modal";

    export default {
        name: 'App',
        components: { persons, modal },
        created() {
            this.$store.dispatch('getUsers');
        },
        computed: {
            tableData() {
                return this.$store.getters.getResult;
            }
        }
    }
</script>

<style lang="less">
    @import "./styles/style.less";
</style>
