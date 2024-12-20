<script setup>
import OrganicLayout from "@/Layouts/OrganicLayout.vue";
import { Head, Link, useForm, usePage } from "@inertiajs/vue3";
import { ref } from "vue";

// defineOptions({ layout: Layout });

const pages = usePage();

let words_list = pages.props.words_list;

</script>

<template>
    <OrganicLayout>
        <Head title="คัดศัพท์จีน" />

        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Word</th>
                    <th>Pinyin</th>
                    <th>Meaning</th>
                    <th>Example</th>
                    <th>Example Pinyin</th>
                    <th>Example Meaning</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="word in words_list" :key="word.id">
                    <td v-text="word.id"></td>
                    <td v-text="word.word"></td>
                    <td v-text="word.pinyin"></td>
                    <td v-text="word.meaning_thai"></td>
                    <td v-text="word.example"></td>
                    <td v-text="word.example_pinyin"></td>
                    <td v-text="word.example_thai"></td>
                </tr>
            </tbody>
        </table>

    </OrganicLayout>

    <!-- <NotFound /> -->
</template>
