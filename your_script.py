
import subprocess

local_path = r'C:\ProgramData\Jenkins\.jenkins\workspace\apibuild\dist\\'
remote_user = 'root'
remote_host = '10.18.11.197'
remote_port = '2232'
remote_path = '/home/'
password = 'Bharuwa@123!@#'

# Construct the scp command
scp_command = [
    'scp',
    '-r',
    '-o', 'StrictHostKeyChecking=no',
    '-P', remote_port,
    '-o', f'PasswordAuthentication=yes',
    local_path,
    f'{remote_user}@{remote_host}:{remote_path}{password}'
]

# Set the environment variable with the password
env = {'SSHPASS': f'{password}'}

# Run the scp command
try:
    subprocess.run(scp_command, check=True, env=env)
    print("SCP transfer successful!")
except subprocess.CalledProcessError as e:
    print(f"SCP transfer failed with error:\n{e}")
