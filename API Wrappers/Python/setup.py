# MIT License
# 
# Copyright (c) 2018 Cameron Henneke
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


"""Setup script for mistypython 

Installs included versions of third party libraries, if those libraries
are not already installed.
"""


from setuptools import setup

packages = [
    'mistypython'
]

install_requires = [
    'requests>=2.18.4',
    'six>=1.11.0,<2dev',
]

long_desc = """A light-weight wrapper for the Misty REST API"""

setup(name='mistypython',
      version='0.0.1',
      description='Python wrapper for Misty REST API',
      long_description=long_desc,
      classifiers=[
        'Development Status :: 3 - Alpha',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 2.7',
        'Topic :: Software Development :: Libraries :: Python Modules'
      ],
      url='https://github.com/cameron-gq/mistypython',
      author='Cameron Henneke',
      author_email='hennekec@gmail.com',
      license='MIT',
      install_requires=install_requires,
      packages=packages,
      include_package_data=True,
      zip_safe=True)
