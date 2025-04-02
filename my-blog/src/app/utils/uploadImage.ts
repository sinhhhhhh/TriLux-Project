export async function handleQuillImageUpload(quillInstance: any) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/upload-thumbnail`,{
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const range = quillInstance.getSelection();
        quillInstance.insertEmbed(range.index, "image", data.url);
      } else {
        alert("Lỗi khi upload ảnh");
      }
    } catch (error) {
      console.error("Upload thất bại:", error);
    }
  };
}
