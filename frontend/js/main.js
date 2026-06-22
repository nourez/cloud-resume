(function () {
  var data = window.resumeData;
  if (!data) return;

  var root = document.getElementById('resume');
  if (!root) return;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function appendSection(title) {
    var section = el('section', 'resume-section');
    section.appendChild(el('h2', 'section-title', title));
    root.appendChild(section);
    return section;
  }

  function appendList(parent, items) {
    var list = el('ul');
    items.forEach(function (item) {
      list.appendChild(el('li', undefined, item));
    });
    parent.appendChild(list);
    return list;
  }

  function renderHeader() {
    var header = el('header', 'resume-header');
    header.appendChild(el('h1', undefined, data.name));

    var contact = el('p', 'contact-info');
    contact.appendChild(document.createTextNode(data.location + ' | '));
    contact.appendChild(document.createTextNode(data.phone + ' | '));

    var emailLink = el('a');
    emailLink.href = 'mailto:' + data.email;
    emailLink.textContent = data.email;
    contact.appendChild(emailLink);
    contact.appendChild(document.createTextNode(' | '));

    var linkedinLink = el('a');
    linkedinLink.href = data.linkedin;
    linkedinLink.textContent = 'linkedin.com/in/nourez';
    linkedinLink.target = '_blank';
    linkedinLink.rel = 'noopener noreferrer';
    contact.appendChild(linkedinLink);

    header.appendChild(contact);
    root.appendChild(header);
  }

  function renderProfile() {
    var section = appendSection('Professional Profile');
    section.appendChild(el('p', undefined, data.profile));
  }

  function renderQualifications() {
    var section = appendSection('Summary of Qualifications');
    appendList(section, data.qualifications);
  }

  function renderSkills() {
    var section = appendSection('Technical Skills');
    var grid = el('div', 'skills-grid');

    Object.keys(data.skills).forEach(function (key) {
      var item = el('div', 'skill-group');
      var label = key.charAt(0).toUpperCase() + key.slice(1);
      if (key === 'libraries') label = 'Libraries + Frameworks';
      item.appendChild(el('strong', undefined, label + ': '));
      item.appendChild(document.createTextNode(data.skills[key]));
      grid.appendChild(item);
    });

    section.appendChild(grid);
  }

  function renderEducation() {
    var section = appendSection('Education');
    data.education.forEach(function (entry) {
      var item = el('div', 'education-entry');
      item.appendChild(
        el('p', 'entry-heading', entry.degree + ', ' + entry.school + ', ' + entry.dates),
      );
      if (entry.details) {
        item.appendChild(el('p', 'entry-detail', entry.details));
      }
      section.appendChild(item);
    });
  }

  function renderCertifications() {
    var section = appendSection('Certifications');
    data.certifications.forEach(function (cert) {
      section.appendChild(el('p', undefined, cert.name + ', ' + cert.date));
    });
  }

  function renderExpertise() {
    var section = appendSection('Areas of Expertise');
    section.appendChild(el('p', 'expertise-list', data.expertise.join(' | ')));
  }

  function renderHighlights() {
    var section = appendSection('Career Highlights');
    appendList(section, data.highlights);
  }

  function renderExperience() {
    var section = appendSection('Professional Experience');
    data.experience.forEach(function (job) {
      var entry = el('article', 'experience-entry');
      entry.appendChild(
        el(
          'h3',
          'job-title',
          job.title + ', ' + job.company + ', ' + job.location + ', ' + job.dates,
        ),
      );
      if (job.description) {
        entry.appendChild(el('p', 'company-description', job.description));
      }
      if (job.bullets && job.bullets.length > 0) {
        appendList(entry, job.bullets);
      }
      section.appendChild(entry);
    });
  }

  renderHeader();
  renderProfile();
  renderQualifications();
  renderSkills();
  renderEducation();
  renderCertifications();
  renderExpertise();
  renderHighlights();
  renderExperience();
})();
