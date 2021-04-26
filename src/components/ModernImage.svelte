<script>
    import { webp as _webp, avif as _avif, jpeg as _jpeg } from "$helpers/helpers";
    export let src;
    export let alt;
    export let visible = false;
    export let loaded = false;
    export let style = "";
    let imgElement;
    export let sizes = "(max-width: 400px) 300px, (max-width: 800px) 400px, (max-width: 1200px) 800px, (max-width: 1600px) 1200px, 5000px";
</script>

<picture>
    <source
        type="image/avif"
        srcset="{_avif(src, 300)} 320w, {_avif(src, 400)} 640w, {_avif(src, 800)} 960w, {_avif(src, 1200)} 1600w, {_avif(src, 1920)}"
        {sizes}
    />
    <source
        type="image/webp"
        srcset="{_webp(src, 300)} 320w, {_webp(src, 400)} 640w, {_webp(src, 800)} 960w, {_webp(src, 1200)} 1600w, {_webp(src, 1920)}"
        {sizes}
    />
    <source
        srcset="{_jpeg(src, 300)} 320w, {_jpeg(src, 400)} 640w, {_jpeg(src, 800)} 960w, {_jpeg(src, 1200)} 1600w, {_jpeg(src, 1920)}"
        {sizes}
    />
    <img
        {src}
        {alt}
        loading="lazy"
        class={$$props.class}
        {style}
        bind:this={imgElement}
        on:load={() => {
            loaded = true;
        }}
        on:enterViewport={() => {
            visible = true;
        }}
        on:exitViewport={() => (visible = false)}
    />
</picture>
