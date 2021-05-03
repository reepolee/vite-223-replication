<script>
    import { webp, avif, img as _img } from "js-helpers";
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
        srcset="{avif(src, 300)} 320w, {avif(src, 400)} 640w, {avif(src, 800)} 960w, {avif(src, 1200)} 1600w, {avif(src, 1920)}"
        {sizes}
    />
    <source
        type="image/webp"
        srcset="{webp(src, 300)} 320w, {webp(src, 400)} 640w, {webp(src, 800)} 960w, {webp(src, 1200)} 1600w, {webp(src, 1920)}"
        {sizes}
    />
    <source srcset="{_img(src, 300)} 320w, {_img(src, 400)} 640w, {_img(src, 800)} 960w, {_img(src, 1200)} 1600w, {_img(src, 1920)}" {sizes} />
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
