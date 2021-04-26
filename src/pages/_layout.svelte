<script>
    import ThemeSwitcher from "$components/ThemeSwitcher.svelte";
    import { TabsTransition } from "@roxi/routify/decorators";
</script>

<div class="container mx-auto">
    <nav class="px-8 py-4 md:p-8 w-full flex flex-row justify-between">
        <a href="/">
            <img src="/images/creatim.logo.svg" alt="Creatim logo" class="h-8 dark:hidden" />
            <img src="/images/creatim.dark.logo.svg" alt="Creatim logo" class="h-8 hidden dark:inline-block" />
        </a>
        <ThemeSwitcher />
    </nav>
    <h1 class="text-xl md:text-3xl px-8 pb-4">Najboljši kuharji so na Creatimu</h1>

    <slot decorator={TabsTransition} />
</div>
