import paramiko
from scp import SCPClient

# SSH Connection Details
hostname = '10.18.11.197'
port = 2232
username = 'root'
password = 'Bharuwa@123!@#'  # You can use key-based authentication for better security

# Local file path
local_file_path = r'D:\\dev test22222\\retailerpos_Frontend\\dist'

# Remote directory path
remote_directory = '/home'

# Create SSH client
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# Connect to SSH server
ssh.connect(hostname, port, username, password)
try:
   
   with SCPClient(ssh.get_transport()) as scp:
        # Copy local file to remote server
        scp.put(local_file_path, remote_directory)

except PermissionError as e:
    print(f"PermissionError: {e}")
