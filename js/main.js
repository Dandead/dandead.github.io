document.addEventListener('DOMContentLoaded', function() {
    loadSiteMap();

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    function loadSiteMap() {
        fetch('data/public.json')
            .then(response => response.json())
            .then(data => {
                const siteMap = document.getElementById('site-map');
                for (let page in data) {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');

                    link.href = "#";
                    link.textContent = page;
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        loadPage(data[page]);
                        sidebar.classList.remove('active');
                    });

                    listItem.appendChild(link);
                    siteMap.appendChild(listItem);
                }
            });
    }

    function loadPage(fileName) {
        fetch(`data/${fileName}`)
            .then(response => response.json())
            .then(data => {
                const content = document.getElementById('content');
                content.innerHTML = `<h2>${data.page_name}</h2>`;

                data.page_description.forEach(item => {
                    if (typeof item === 'string') {
                        content.innerHTML += `<p>${item}</p>`;
                    } else if (item.table) {
                        content.innerHTML += generateTable(item.table);
                    }
                });

                const pageData = document.createElement('div');

                data.page_data.forEach(item => {
                    if (item.text) {
                        pageData.innerHTML += `<p>${item.text}</p>`;
                    } else if (item.image) {
                        pageData.innerHTML += generateImage(item.image);
                    } else if (item.list) {
                        pageData.innerHTML += generateList(item.list);
                    } else if (item.group) {
                        const groupHeader = document.createElement('h3');
                        groupHeader.textContent = item.group;
                        groupHeader.style.textAlign = 'center';

                        const groupDescription = document.createElement('p');
                        groupDescription.textContent = item.group_description;
                        groupDescription.style.textAlign = 'center';

                        pageData.appendChild(groupHeader);
                        pageData.appendChild(groupDescription);

                        item.group_data.forEach(block => {
                            const blockElement = document.createElement('div');
                            blockElement.classList.add('content-block');
                            blockElement.innerHTML = `<h4>${block.name}</h4>`;

                            block.obj_image.forEach(img => {
                                blockElement.innerHTML += generateImage(img);
                            });

                            block.data.forEach(dataItem => {
                                if (typeof dataItem === 'string') {
                                    blockElement.innerHTML += `<p>${dataItem}</p>`;
                                } else if (dataItem.table) {
                                    blockElement.innerHTML += generateTable(dataItem.table);
                                } else if (dataItem.image) {
                                    blockElement.innerHTML += generateImage(dataItem.image);
                                } else if (dataItem.list) {
                                    blockElement.innerHTML += generateList(dataItem.list);
                                }
                            });

                            pageData.appendChild(blockElement);
                        });
                    }
                });

                content.appendChild(pageData);
            });
    }

    function generateTable(tableData) {
        let tableHTML = '<table class="content-table">';
        tableData.forEach((row, index) => {
            tableHTML += '<tr>';
            row.forEach(cell => {
                if (index === 0 && cell) {
                    tableHTML += `<th>${cell}</th>`;
                } else if (cell) {
                    tableHTML += `<td>${cell}</td>`;
                }
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</table>';
        return tableHTML;
    }

    function generateList(listItems) {
        let listHTML = '<ul>';
        listItems.forEach(item => {
            listHTML += `<li>${item}</li>`;
        });
        listHTML += '</ul>';
        return listHTML;
    }

    function generateImage(imageData) {
        return `<img src="../images/${imageData.src}" alt="${imageData.alt}" style="width: ${imageData.width}; height: ${imageData.height}; cursor: pointer;" onclick="openImage('../images/${imageData.src}');">`;
    }

    window.openImage = function(src) {
        const imageModal = document.createElement('div');
        imageModal.style.position = 'fixed';
        imageModal.style.top = '0';
        imageModal.style.left = '0';
        imageModal.style.width = '100%';
        imageModal.style.height = '100%';
        imageModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        imageModal.style.display = 'flex';
        imageModal.style.alignItems = 'center';
        imageModal.style.justifyContent = 'center';
        imageModal.style.zIndex = '1000';

        const imageElement = document.createElement('img');
        imageElement.src = src;
        imageElement.style.maxWidth = '90%';
        imageElement.style.maxHeight = '90%';
        imageElement.style.boxShadow = '0 0 20px #fff';

        imageModal.appendChild(imageElement);
        document.body.appendChild(imageModal);

        imageModal.addEventListener('click', function() {
            document.body.removeChild(imageModal);
        });
    }

    fetch('data/public.json')
        .then(response => response.json())
        .then(data => {
            const firstPage = Object.values(data)[0];
            loadPage(firstPage);
        });
});
