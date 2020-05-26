<template>
    <div id="app" class="app">
        <div class="task-table">
            <persons v-if="tableData"
                     :users="tableData"
            />
        </div>

        <transition name="vue-anim">
            <modal></modal>
        </transition>
    </div>
</template>

<script>
    import persons from "@/components/persons";
    import modal from "@/components/modal";

    export default {
        name: 'App',
        components: {persons, modal},
        created() {
            this.$store.dispatch('getData');
        },
        computed: {

            /**
             * Вызов метода для получения готового состояния приложения.
             *
             * @return {any}
             */
            tableData() {
                return this.$store.getters.getResult;
            }
        }
    }
</script>

<style lang="less">
    @import "./styles/style.less";
</style>
