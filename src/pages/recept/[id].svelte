<!-- routify:options param-is-page  -->
<script>
    import { route, layout, page } from "@roxi/routify";
    import { dishes } from "$data/dishes.json";
    import ModernImage from "$components/ModernImage.svelte";

    export let id;

    $route.api.meta.index = id;

    let recept = dishes.find((el) => el.id === +id);
    let next = dishes.find((el) => el.id === +id + 1);
    let prev = dishes.find((el) => el.id === +id - 1);
</script>

<div class="flex justify-center w-full px-8">
    <div class="flex flex-col pt-4 w-full gap-8">
        <div class="w-full flex flex-col sm:flex-row justify-start sm:justify-between sm:items-center">
            <a href="/" class="bg-creatim-500 text-white p-2 pl-4 font-bold rounded w-max"> &larr; Nazaj na spisek</a>
            <!-- <div class="flex justify-between space-x-0 sm:space-x-4 sm:justify-end flex-1 sm:text-right pt-8 sm:pt-0">
<div class="sm:w-32">
{#if prev}
  <a href="/recept/{prev.id}" class="border border-creatim-500 p-2 rounded">&#9664; Predhodni</a>
{/if}
</div>
<div class="sm:w-32">
{#if next}
  <a href="/recept/{next.id}" class="border border-creatim-500 p-2 rounded">Naslednji &#9654;</a>
{/if}
</div>
</div> -->
        </div>

        <div class="receptbox">
            <div id="left-1">
                <h2 class="lg:text-xl">
                    {recept.title}
                </h2>
            </div>
            <div id="right-1" />
            <div id="left-1">
                <div class="aspect-w-3 aspect-h-2 shadow-2xl">
                    <ModernImage src={recept.image} alt={recept.title} sizes="" class="w-full h-full" />
                </div>
                <div class="flex justify-between items-center py-2">
                    <p class="italic">
                        {recept.chef}
                    </p>
                </div>
            </div>

            <div id="right-2">
                <h3>Sestavine:</h3>
                {#each recept.ingredients as ingredient}
                    <div class="flex flex-row items-center gap-2">
                        <div>{@html ingredient.amount}</div>
                        <div>{@html ingredient.text}</div>
                    </div>
                {:else}
                    <p>Dodaj sestavine</p>
                {/each}
                <h3 class="pt-4">Priprava:</h3>
                {#each recept.steps as step}
                    <div class="flex flex-row items-center gap-2">
                        <div>{@html step.text}</div>
                    </div>
                {:else}
                    <p>Dodaj postopek</p>
                {/each}
            </div>
        </div>
        <div class="py-8">
            <a href="/" class="bg-creatim-500 text-white p-2 pl-4 font-bold rounded"> &larr; Nazaj na spisek</a>
        </div>
    </div>
</div>

<style>
    h2 {
        @apply font-bold text-xl;
    }

    h3 {
        @apply font-bold;
    }
</style>
