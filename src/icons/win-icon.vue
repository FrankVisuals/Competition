<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 10c-3.865 0-7 3.134-7 7s3.135 7 7 7 7-3.134 7-7-3.135-7-7-7zm0 13c-3.314 0-6-2.687-6-6s2.686-6 6-6 6 2.687 6 6-2.686 6-6 6zm-4-23l5.958 8h-3.958l-6-8h4zm6.604 7.194l5.396-7.194h-4l-3.376 4.534 1.98 2.66zm-2.604 4.806c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm1 8h-1v-4h-2v-.859c.438 0 1.766-.047 2.172-1.141h.828v6z"
    />
  </svg>
</template>

<script>
import IconMixin from "./icon"

export default {
  mixins: [IconMixin]
}
</script>
