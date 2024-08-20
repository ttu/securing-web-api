import os
import boto3
import json
import glob
import mimetypes
from botocore.exceptions import ClientError


def set_aws_credentials():
    """Set dummy AWS credentials for LocalStack."""
    os.environ["AWS_ACCESS_KEY_ID"] = "dummy"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "dummy"
    os.environ["AWS_DEFAULT_REGION"] = "us-east-1"


def create_s3_client(endpoint_url="http://localhost:4566", region_name="us-east-1"):
    """Create and return an S3 client with the given endpoint and region."""
    return boto3.client("s3", endpoint_url=endpoint_url, region_name=region_name)


def create_bucket(s3_client, bucket_name):
    """Create an S3 bucket."""
    try:
        s3_client.create_bucket(Bucket=bucket_name)
        print(f"Bucket '{bucket_name}' created successfully.")
        # s3_client.delete_bucket_encryption(Bucket=bucket_name)
    except ClientError as e:
        print(f"Error creating bucket '{bucket_name}': {e}")


def apply_bucket_policy(s3_client, bucket_name):
    """Apply a public read bucket policy to the specified bucket."""
    bucket_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": f"arn:aws:s3:::{bucket_name}/*",
            }
        ],
    }

    try:
        s3_client.put_bucket_policy(
            Bucket=bucket_name, Policy=json.dumps(bucket_policy)
        )
        print(f"Bucket policy applied to '{bucket_name}'.")
    except ClientError as e:
        print(f"Error applying bucket policy to '{bucket_name}': {e}")


def upload_files_to_s3(s3_client, bucket_name, directory_path="/tmp/data/*"):
    """Upload all files from the specified directory to the S3 bucket."""
    files = glob.glob(directory_path)

    for file_path in files:
        file_name = os.path.basename(file_path)
        content_type = mimetypes.guess_type(file_path)[0] or "binary/octet-stream"

        try:
            s3_client.upload_file(
                file_path,
                bucket_name,
                file_name,
                ExtraArgs={"ContentType": content_type},
            )
            print(
                f"Uploaded '{file_name}' to '{bucket_name}' with ContentType '{content_type}'."
            )
        except ClientError as e:
            print(f"Error uploading '{file_name}' to '{bucket_name}': {e}")


def main():
    set_aws_credentials()

    s3_client = create_s3_client()
    bucket_name = "my-local-bucket"

    create_bucket(s3_client, bucket_name)
    apply_bucket_policy(s3_client, bucket_name)
    upload_files_to_s3(s3_client, bucket_name)


main()
