<script>
  import { dishes } from "$data/dishes.json";
  import ModernImage from "$components/ModernImage.svelte";
</script>

<div class="flex justify-center w-full px-8">
  <div class="gridbox pt-4 w-full box">
    {#each dishes as dish}
      <a class="w-full" href="/recept/{dish.id}">
        <div class="aspect-w-3 aspect-h-2 shadow-2xl">
          <ModernImage src={dish.image} alt={dish.title} sizes="" class="w-full h-full" />
        </div>
        <div class="flex justify-between items-center py-2  font-semibold">
          <h2>
            {dish.title}
          </h2>
          <p class="text-right italic">
            {dish.chef}
          </p>
        </div>
      </a>
    {/each}
  </div>
</div>
