/* =====================================================================
   Contenido editable del Home: libros y comentarios.
   Rellena los arreglos y vuelve a compilar (python3 tools/build.py).
   Mientras un arreglo esté vacío, la sección muestra espacios «Por completar».

   Libro:       { title: 'Título', author: 'Autor', note: { es: '…', en: '…' } }   (note es opcional)
   Comentario:  { quote: { es: '…', en: '…' }, name: 'Nombre', role: { es: 'Cargo', en: 'Role' },
                  relation: { es: 'Empresa donde coincidimos', en: '…' }, linkedin: 'https://…' }   (relation y linkedin opcionales; \n\n separa párrafos)
   ===================================================================== */
window.LC_HOME_DATA = {
  books: {
    carrera: [],   // libros sobre diseño, producto, UX, datos…
    otros: []      // otros libros
  },
  // Recomendaciones reales (texto original; en inglés se marca como traducción).
  comments: [
    {
      "name": "Diego Jesús Romano Tangassi",
    "linkedin": "https://www.linkedin.com/in/diego-jesus-romano-tangassi-a98b68145/",
      "role": {
        "es": "Director de Operaciones",
        "en": "Director of Operations"
      },
      "quote": {
        "es": "El ingenio y responsabilidad de Laura en el diseño para colocar al usuario al centro de nuestra estrategia de capitalización de datos resultó en el éxito de una de las plataformas analíticas más importantes de nuestra compañía. Excelente colaboración y sinergia, esperamos cruzar caminos nuevamente pronto.",
        "en": "Laura’s ingenuity and responsibility in design, placing the user at the center of our data capitalization strategy, resulted in the success of one of our company’s most important analytics platforms. Excellent collaboration and synergy; we hope to cross paths again soon."
      }
    },
    {
      "name": "Zashel Lara",
      "linkedin": "https://www.linkedin.com/in/zashel-lara/",
      "role": {
        "es": "Lead UX",
        "en": "Lead UX"
      },
      "relation": {
        "es": "Walmart de México",
        "en": "Walmart Mexico"
      },
      "quote": {
        "es": "Tuve el gusto de trabajar con Laura durante su rol de product designer en Walmart de México, que fue una experiencia muy positiva y enriquecedora. Es una persona proactiva, siempre dispuesta a aportar ideas y asumir nuevos desafíos. Su nivel de compromiso es admirable; cuando se pone una meta, sabes que va a darlo todo para alcanzarla.\n\nAlgo que realmente destacó fue su habilidad para defender sus propuestas. No importa cuán complicado sea el contexto o los stakeholders involucrados, Laura siempre encuentra la forma de expresar su visión de manera clara y firme.\n\nAdemás, tiene una gran capacidad para recibir feedback y aplicarlo de forma constructiva, lo que la hace crecer con cada proyecto. Trabajar con ella fue un verdadero gusto y puedo decir que donde sea que esté, su talento y actitud serán una gran contribución.",
        "en": "I had the pleasure of working with Laura during her role as product designer at Walmart Mexico, and it was a very positive and enriching experience. She is proactive, always willing to contribute ideas and take on new challenges. Her level of commitment is admirable; when she sets a goal, you know she will give it her all to reach it.\n\nSomething that really stood out was her ability to defend her proposals. No matter how complicated the context or the stakeholders involved, Laura always finds a way to express her vision clearly and firmly.\n\nShe also has a great ability to receive feedback and apply it constructively, which helps her grow with every project. Working with her was a real pleasure, and wherever she is, her talent and attitude will be a great contribution."
      }
    },
    {
      "name": "Sergio Villanueva",
    "linkedin": "https://www.linkedin.com/in/tiburonmartillo/",
      "role": {
        "es": "Data Product Designer",
        "en": "Data Product Designer"
      },
      "relation": {
        "es": "Walmart de México y Centroamérica",
        "en": "Walmart Mexico and Central America"
      },
      "quote": {
        "es": "He tenido el placer de trabajar junto a Laura en Walmart de México y Centroamérica, y puedo afirmar con confianza que sus habilidades en diseño centrado en el usuario son excepcionales y alineadas con los valores de innovación centrada en el cliente de Walmart. Su capacidad para comprender las necesidades y preferencias de nuestros clientes, y traducirlas en experiencias digitales intuitivas y atractivas, ha sido invaluable para nuestro equipo.\n\nA lo largo de nuestras colaboraciones, Laura ha demostrado un fuerte trabajo ético, una pasión por el diseño UX, y un compromiso con la entrega de resultados de alta calidad que cumplan o superen los estándares de Walmart. Ha demostrado una disposición para aprender y adaptarse, y ha sido un miembro integral de equipos multidisciplinarios, trabajando eficazmente con stakeholders, desarrolladores y otros diseñadores para impulsar los proyectos hacia adelante.\n\nLes recomiendo encarecidamente a Laura para cualquier organización que busque un profesional dedicado y talentoso en UX que pueda entregar resultados excepcionales mientras se ajusta a los más altos estándares éticos. Es un activo valioso para cualquier equipo, y espero poder seguir trabajando con ella en el futuro.",
        "en": "I have had the pleasure of working alongside Laura at Walmart Mexico and Central America, and I can confidently say that her user-centered design skills are exceptional and aligned with Walmart’s values of customer-centered innovation. Her ability to understand our customers’ needs and preferences, and translate them into intuitive and engaging digital experiences, has been invaluable to our team.\n\nThroughout our collaborations, Laura has shown a strong work ethic, a passion for UX design and a commitment to delivering high-quality results that meet or exceed Walmart’s standards. She has shown a willingness to learn and adapt, and has been an integral member of multidisciplinary teams, working effectively with stakeholders, developers and other designers to move projects forward.\n\nI highly recommend Laura to any organization looking for a dedicated and talented UX professional who can deliver exceptional results while upholding the highest ethical standards. She is a valuable asset to any team, and I hope to keep working with her in the future."
      }
    },
    {
      "name": "Graciela López",
    "linkedin": "https://www.linkedin.com/in/gracielalopezux/es/",
      "role": {
        "es": "UX Designer",
        "en": "UX Designer"
      },
      "relation": {
        "es": "Walmart",
        "en": "Walmart"
      },
      "quote": {
        "es": "Laura Ibañez destaca como una diseñadora de interfaces con un gran talento para crear experiencias visuales que conectan profundamente con el usuario. En Walmart, demostró una habilidad excepcional para defender sus propuestas con claridad y confianza, reflejando tanto su conocimiento en UX como su compromiso con la calidad en cada detalle.\n\nSu disposición para colaborar e integrar feedback de forma constructiva habla de su constante crecimiento como profesional.\n\nRecomiendo sinceramente a Laura para cualquier posición en la que la creatividad y la calidad sean aspectos fundamentales. Sin duda, su talento será una gran aportación a cualquier equipo.",
        "en": "Laura Ibañez stands out as an interface designer with great talent for creating visual experiences that connect deeply with users. At Walmart, she showed an exceptional ability to defend her proposals with clarity and confidence, reflecting both her UX knowledge and her commitment to quality in every detail.\n\nHer willingness to collaborate and integrate feedback constructively speaks to her constant growth as a professional.\n\nI sincerely recommend Laura for any position where creativity and quality are fundamental. Her talent will undoubtedly be a great contribution to any team."
      }
    },
    {
      "name": "Julián Salinas",
    "linkedin": "https://www.linkedin.com/in/juliansinai/es/",
      "role": {
        "es": "User Experience Consultant",
        "en": "User Experience Consultant"
      },
      "quote": {
        "es": "Tuve el placer de trabajar con Laura Ibañez en proyectos UX donde demostró una habilidad excepcional para anticiparse a problemas futuros y ofrecer soluciones con un nivel de detalle y precisión destacables. Su capacidad para ver más allá de los requerimientos actuales y considerar el impacto a largo plazo hizo una gran diferencia en la calidad del producto final. Además, su responsabilidad y compromiso son su carta de presentación; siempre dispuesta a profundizar en su conocimiento y abierta al aprendizaje constante, lo que la convierte en una profesional en constante evolución. Recomiendo ampliamente a Laura para cualquier rol donde la calidad, la visión estratégica y el crecimiento sean esenciales. Un gusto compartir espacios y proyectos con ella.",
        "en": "I had the pleasure of working with Laura Ibañez on UX projects where she showed an exceptional ability to anticipate future problems and offer solutions with remarkable detail and precision. Her ability to look beyond current requirements and consider long-term impact made a big difference in the quality of the final product. Her responsibility and commitment are her calling card; she is always willing to deepen her knowledge and open to constant learning, which makes her a professional in constant evolution. I highly recommend Laura for any role where quality, strategic vision and growth are essential. It was a pleasure to share spaces and projects with her."
      }
    },
    {
      "name": "David Garay Rodriguez",
      "linkedin": "https://www.linkedin.com/in/davidgrprogramador/es/",
      "role": {
        "es": "Senior Full Stack Developer",
        "en": "Senior Full Stack Developer"
      },
      "quote": {
        "es": "Trabajar con Laura Ibañez fue una experiencia muy positiva. Como diseñadora UI/UX, no solo destaca por su talento para crear interfaces limpias y centradas en el usuario, sino también por su actitud abierta, colaborativa y siempre dispuesta a mejorar el resultado final. Tiene una gran sensibilidad para entender tanto las necesidades del usuario como las del equipo técnico, lo que hizo que trabajar a su lado fuera muy fluido y enriquecedor. Sin duda, es una gran compañera de equipo y una profesional en la que se puede confiar.",
        "en": "Working with Laura Ibañez was a very positive experience. As a UI/UX designer, she stands out not only for her talent for creating clean, user-centered interfaces, but also for her open, collaborative attitude, always willing to improve the final result. She has great sensitivity to understand both users’ needs and the technical team’s needs, which made working alongside her smooth and enriching. She is undoubtedly a great teammate and a professional you can trust."
      }
    },
    {
      "name": "Benjamin Resendiz Mejia",
    "linkedin": "https://www.linkedin.com/in/benjaminresendizmejia/",
      "role": {
        "es": "Líder de desarrollo",
        "en": "Development Lead"
      },
      "relation": {
        "es": "Grupo Salinas · BI Consultores",
        "en": "Grupo Salinas · BI Consultores"
      },
      "quote": {
        "es": "Tuve la oportunidad de colaborar con Laura en dos etapas profesionales, primero en Grupo Salinas y posteriormente en BI Consultores, lo que me permitió conocer de cerca su forma de trabajar y su compromiso profesional.\n\nLaura es una persona que destaca por su responsabilidad, dedicación y capacidad para afrontar nuevos retos. Su disposición para colaborar, aportar soluciones y mantener una actitud positiva ante los desafíos la convierten en una excelente compañera de equipo.\n\nAlgo que valoro especialmente es su compromiso con los resultados y su capacidad para adaptarse a diferentes entornos de trabajo, siempre buscando aportar valor a los proyectos en los que participa.\n\nSin duda, recomiendo a Laura como una profesional confiable, comprometida y con mucho que aportar a cualquier organización. Fue un gusto coincidir y colaborar con ella en ambas empresas.",
        "en": "I had the opportunity to work with Laura at two stages of our careers, first at Grupo Salinas and later at BI Consultores, which allowed me to see her way of working and her professional commitment up close.\n\nLaura stands out for her responsibility, dedication and ability to take on new challenges. Her willingness to collaborate, contribute solutions and keep a positive attitude in the face of challenges makes her an excellent teammate.\n\nSomething I especially value is her commitment to results and her ability to adapt to different work environments, always seeking to add value to the projects she is part of.\n\nI wholeheartedly recommend Laura as a reliable, committed professional with a lot to contribute to any organization. It was a pleasure to work with her at both companies."
      }
    }
  ]
};
