// Toggle visibility of plot sections
document.getElementById('btn-1d').addEventListener('click', () => togglePlots('plot-section-1d'));
document.getElementById('btn-2d').addEventListener('click', () => togglePlots('plot-section-2d'));
document.getElementById('btn-3d').addEventListener('click', () => togglePlots('plot-section-3d'));

function togglePlots(activeSectionId) {
    const sections = document.querySelectorAll('.plot-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === activeSectionId) {
            section.classList.add('active');
        }
    });
}

$(document).ready(function () {
    let availablePDFs = [];

    $.ajax({
        url: '/available_pdfs',
        method: 'GET',
        success: function (data) {
            availablePDFs = data;

            // Initialize autocomplete for the primary PDF set
            $("#pdf").autocomplete({
                source: availablePDFs,
                minLength: 0
            }).focus(function () {
                $(this).autocomplete("search", "");
            });

            // Initialize autocomplete for 2D and 3D PDF sets
            $("#pdf-2d").autocomplete({
                source: availablePDFs,
                minLength: 0
            }).focus(function () {
                $(this).autocomplete("search", "");
            });

            $("#pdf-3d").autocomplete({
                source: availablePDFs,
                minLength: 0
            }).focus(function () {
                $(this).autocomplete("search", "");
            });
        },
        error: function (error) {
            console.error('Error fetching available PDF sets:', error);
        }
    });

    // Function to initialize autocomplete for a new PDF set input
    function initializeAutocomplete(input) {
        $(input).autocomplete({
            source: availablePDFs,
            minLength: 0
        }).focus(function () {
            $(this).autocomplete("search", "");
        });
    }

    // Add another PDF set input box
    $('#add-pdf-set').on('click', function () {
        const newPdfSet = $('<div class="form-group pdf-set-group"><label for="pdf">PDF Set:</label><input type="text" class="pdf-set" name="pdf" placeholder="Select or type PDF set"></div>');
        $('#additional-pdf-sets').append(newPdfSet);
        initializeAutocomplete(newPdfSet.find('input.pdf-set'));
    });

    // Clear plot button functionality
    $('#clear-plot').on('click', function () {
        if (chart) {
            chart.destroy();
            chart = null;
        }
    });

    // 1D Plot Handling
    $('#plot-form').on('submit', async function (event) {
        event.preventDefault();

        const pdfSets = [];
        $('.pdf-set-group input[type="text"]').each(function () {
            const pdfValue = $(this).val().trim();
            if (pdfValue) {
                pdfSets.push(pdfValue);
            }
        });

        const xMin = $('#xMin').val();
        const xMax = $('#xMax').val();
        const qMin = $('#qMin').val();
        const qMax = $('#qMax').val();
        const flavours = $('#flavours').val();
        const logX = $('#logX').is(':checked');
        const logQ = $('#logQ').is(':checked');
        const logY = $('#logY').is(':checked');

        try {
            for (const pdf of pdfSets) {
                let url = `/pdf_values?pdf=${pdf}&flavours=${flavours}`;
                if (xMin && xMax) {
                    url += `&xMin=${xMin}&xMax=${xMax}`;
                }
                if (qMin && qMax) {
                    url += `&qMin=${qMin}&qMax=${qMax}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    renderPlot(data, pdf, logX, logQ, logY);
                } else {
                    console.error('Error fetching plot data:', data.error);
                    alert('Error fetching plot data. Check console for details.');
                }
            }
        } catch (error) {
            console.error('Error fetching plot data:', error);
            alert('Error fetching plot data. Check console for details.');
        }
    });

    let chart;

    function renderPlot(data, pdf, logX, logQ, logY) {
        const ctx = document.getElementById('plot').getContext('2d');

        if (!chart) {
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.xs.length ? data.xs : data.Qs,
                    datasets: []
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: `PDF Values`,
                        font: {
                            size: 18 // Larger title font size
                        }
                    },
                    scales: {
                        x: {
                            type: logX ? 'logarithmic' : 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: data.xs.length ? 'x' : 'Q',
                                font: {
                                    size: 14 // Larger x-axis label font size
                                }
                            }
                        },
                        y: {
                            type: logY ? 'logarithmic' : 'linear',
                            title: {
                                display: true,
                                text: 'PDF Value',
                                font: {
                                    size: 14 // Larger y-axis label font size
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 12 // Larger legend font size
                                }
                            }
                        }
                    }
                }
            });
        }

        const datasets = Object.keys(data.values[pdf].pdf_values).map((flavour, index) => {
            return {
                label: `${pdf} - Flavour ${flavour}`,
                data: data.values[pdf].pdf_values[flavour].flat().flat(),
                borderColor: `hsl(${index * 60}, 100%, 50%)`,
                fill: false,
            };
        });

        chart.data.datasets.push(...datasets);
        chart.update();
    }

    // 2D Plot Handling
    document.getElementById('plot-form-2d').addEventListener('submit', async function (event) {
        event.preventDefault();

        const pdf = document.getElementById('pdf-2d').value;
        const xMin = document.getElementById('xMin-2d').value;
        const xMax = document.getElementById('xMax-2d').value;
        const Q2Min = document.getElementById('Q2Min').value;
        const Q2Max = document.getElementById('Q2Max').value;
        const pid = document.getElementById('pid').value;

        const logX = document.getElementById('logX-2d').checked;
        const logQ2 = document.getElementById('logQ2-2d').checked;

        try {
            let url = `/pdf_values_2d?pdf=${pdf}&xMin=${xMin}&xMax=${xMax}&Q2Min=${Q2Min}&Q2Max=${Q2Max}&pid=${pid}`;

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                renderPlot2D(data, logX, logQ2);
            } else {
                console.error('Error fetching 2D plot data:', data.error);
                alert('Error fetching 2D plot data. Check console for details.');
            }
        } catch (error) {
            console.error('Error fetching 2D plot data:', error);
            alert('Error fetching 2D plot data. Check console for details.');
        }
    });

    function renderPlot2D(data, logX, logQ2) {
        const xs = data.xs;
        const Q2s = data.Q2s;
        const pdf_values = data.pdf_values;

        const trace = {
            x: xs,
            y: Q2s,
            z: pdf_values,
            type: 'heatmap',
            colorscale: 'Viridis'
        };

        const layout = {
            title: {
                text: '2D PDF Plot',
                font: {
                    size: 18 // Larger title font size
                }
            },
            xaxis: {
                title: {
                    text: 'x',
                    type: logX ? 'log' : 'linear',
                    font: {
                        size: 14 // Larger x-axis label font size
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Q²',
                    type: logQ2 ? 'log' : 'linear',
                    font: {
                        size: 14 // Larger y-axis label font size
                    }
                }
            },
            width: 800,
            height: 600,
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 10
            }
        };

        Plotly.newPlot('plot-2d', [trace], layout);
    }

    // 3D Plot Handling
    document.getElementById('plot-form-3d').addEventListener('submit', async function (event) {
        event.preventDefault();

        const pdf = document.getElementById('pdf-3d').value;
        const xMin = document.getElementById('xMin-3d').value;
        const xMax = document.getElementById('xMax-3d').value;
        const Q2Min = document.getElementById('Q2Min-3d').value;
        const Q2Max = document.getElementById('Q2Max-3d').value;
        const pid = document.getElementById('pid-3d').value;

        const logX = document.getElementById('logX-3d').checked;
        const logQ2 = document.getElementById('logQ2-3d').checked;

        try {
            const response = await fetch(`/pdf_values_2d?pdf=${pdf}&xMin=${xMin}&xMax=${xMax}&Q2Min=${Q2Min}&Q2Max=${Q2Max}&pid=${pid}`);
            const data = await response.json();

            if (response.ok) {
                render3DPlot(data, logX, logQ2);
            } else {
                console.error('Error fetching plot data:', data.error);
                alert('Error fetching plot data. Check console for details.');
            }
        } catch (error) {
            console.error('Error fetching plot data:', error);
            alert('Error fetching plot data. Check console for details.');
        }
    });

    function render3DPlot(data, logX, logQ2) {
        const xs = data.xs;
        const Q2s = data.Q2s;
        const values = data.pdf_values;

        const plotData = [{
            x: xs,
            y: Q2s,
            z: values,
            type: 'surface',
            colorscale: 'Viridis',
        }];

        const layout = {
            title: {
                text: '3D Surface Plot',
                font: {
                    size: 18 // Larger title font size
                }
            },
            width: 1000,
            height: 1000,
            scene: {
                xaxis: {
                    title: {
                        text: 'x',
                        type: logX ? 'log' : 'linear',
                        tickformat: ".2e",
                        font: {
                            size: 14 // Larger x-axis label font size
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Q²',
                        type: logQ2 ? 'log' : 'linear',
                        tickformat: ".2e",
                        font: {
                            size: 14 // Larger y-axis label font size
                        }
                    }
                },
                zaxis: {
                    title: {
                        text: 'PDF Value',
                        tickformat: ".2e",
                        font: {
                            size: 14 // Larger z-axis label font size
                        }
                    }
                },
                camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                }
            },
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 10
            },
            autosize: false,
        };

        Plotly.newPlot('plot-3d', plotData, layout);
    }

});
