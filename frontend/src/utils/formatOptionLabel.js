export const formatOptionLabel = (value) => {
    if (!value) return "";
    return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};