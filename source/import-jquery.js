import jquery from "jquery";

export default (window.$ = window.jQuery = jquery);

// Handles issues with jQuery global var in Parcel.
