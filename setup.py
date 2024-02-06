# setup.py

from setuptools import setup, find_packages

setup(
    name='gradio-tunneling',
    version='0.1.0',
    packages=find_packages(),
    package_data={
        'gradio_tunneling': ['frpc*'],
    },
    install_requires=[
        # List your dependencies here
        'requests',
        # 'some-other-package',
    ],
    entry_points={
        'console_scripts': [
            'gradio-tunneling=gradio_tunneling.main:main',
        ],
    },
    python_requires='>=3.8',
)

