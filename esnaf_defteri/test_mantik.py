import cloudinary
import cloudinary.api
import cloudinary.uploader
from decouple import config


def main():
    cloudinary.config(
        cloud_name=config("CLOUDINARY_CLOUD_NAME"),
        api_key=config("CLOUDINARY_API_KEY"),
        api_secret=config("CLOUDINARY_API_SECRET"),
    )

    # Sandbox/CI ortamlarında dış network erişimi kapalı olabilir.
    # Bu dosya sadece Cloudinary config ve URL dönüşümünü doğrulasın diye
    # varsayılan olarak upload yapmıyoruz.
    do_upload = config("DO_CLOUDINARY_UPLOAD", default=False, cast=bool)
    if not do_upload:
        sample_public_id = "demo/sample_image"
        transformed_url = cloudinary.utils.cloudinary_url(
            sample_public_id,
            transformation=[{"f_auto": "auto", "q_auto": "auto"}],
        )[0]
        print("--- Cloudinary Config OK (upload atlanmis) ---")
        print("Ornek transformed URL:", transformed_url)
        return

    image_url = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
    upload_result = cloudinary.uploader.upload(image_url)

    print("--- Yükleme Başarılı ---")
    print(f"Güvenli URL: {upload_result['secure_url']}")
    print(f"Public ID: {upload_result['public_id']}")

    print("\n--- Görsel Detayları ---")
    print(f"Genişlik: {upload_result['width']}px")
    print(f"Yükseklik: {upload_result['height']}px")
    print(f"Format: {upload_result['format']}")
    print(f"Dosya Boyutu: {upload_result['bytes']} bytes")

    transformed_url = cloudinary.utils.cloudinary_url(
        upload_result["public_id"],
        transformation=[{"f_auto": "auto", "q_auto": "auto"}],
    )[0]

    print("\n--- Dönüşüm Tamamlandı ---")
    print(transformed_url)


if __name__ == "__main__":
    main()